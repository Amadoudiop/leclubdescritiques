<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * Category
 *
 * @ORM\Table(name="category")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CategoryRepository")
 */
class Category
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @Assert\NotBlank()
     * @Assert\Length(min=3)
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="SubCategory", mappedBy="category")
     */
    private $subCategories;

    /**
     * @ORM\OneToMany(targetEntity="Oeuvre", mappedBy="category")
     */
    private $oeuvres;


    public function __construct()
    {
        $this->oeuvres = new ArrayCollection();
        $this->subCategories = new ArrayCollection();

    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Category
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Add subCategory
     *
     * @param \AppBundle\Entity\SubCategory $subCategory
     *
     * @return Category
     */
    public function addSubCategory(\AppBundle\Entity\SubCategory $subCategory)
    {
        $this->subCategories[] = $subCategory;

        return $this;
    }

    /**
     * Remove subCategory
     *
     * @param \AppBundle\Entity\SubCategory $subCategory
     */
    public function removeSubCategory(\AppBundle\Entity\SubCategory $subCategory)
    {
        $this->subCategories->removeElement($subCategory);
    }

    /**
     * Get subCategories
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSubCategories()
    {
        return $this->subCategories;
    }

    /**
     * Add oeuvre
     *
     * @param \AppBundle\Entity\Oeuvre $oeuvre
     *
     * @return Category
     */
    public function addOeuvre(\AppBundle\Entity\Oeuvre $oeuvre)
    {
        $this->oeuvres[] = $oeuvre;

        return $this;
    }

    /**
     * Remove oeuvre
     *
     * @param \AppBundle\Entity\Oeuvre $oeuvre
     */
    public function removeOeuvre(\AppBundle\Entity\Oeuvre $oeuvre)
    {
        $this->oeuvres->removeElement($oeuvre);
    }

    /**
     * Get oeuvres
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getOeuvres()
    {
        return $this->oeuvres;
    }
}
