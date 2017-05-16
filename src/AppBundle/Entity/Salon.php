<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Salon
 *
 * @ORM\Table(name="salon")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SalonRepository")
 */
class Salon
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
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var int
     *
     * @ORM\Column(name="participants_number", type="integer")
     */
    private $participants_number;


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
     * Set title
     *
     * @param string $title
     *
     * @return Salon
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set participantsNumber
     *
     * @param integer $participantsNumber
     *
     * @return Salon
     */
    public function setParticipantsNumber($participantsNumber)
    {
        $this->participants_number = $participantsNumber;

        return $this;
    }

    /**
     * Get participantsNumber
     *
     * @return int
     */
    public function getParticipantsNumber()
    {
        return $this->participants_number;
    }
}

