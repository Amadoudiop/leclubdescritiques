<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * UserOeuvre
 *
 * @ORM\Table(name="user_oeuvre")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserOeuvreRepository")
 */
class UserOeuvre
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
     * @var int
     *
     * @ORM\Column(name="id_user", type="integer")
     */
    private $idUser;

    /**
     * @var int
     *
     * @ORM\Column(name="id_oeuvre", type="integer")
     */
    private $idOeuvre;

    /**
     * @var int
     *
     * @ORM\Column(name="id_status", type="integer")
     */
    private $idStatus;

    /**
     * @var float
     *
     * @ORM\Column(name="rating", type="float")
     */
    private $rating;

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
     * Set idUser
     *
     * @param integer $idUser
     *
     * @return UserOeuvre
     */
    public function setIdUser($idUser)
    {
        $this->idUser = $idUser;

        return $this;
    }

    /**
     * Get idUser
     *
     * @return int
     */
    public function getIdUser()
    {
        return $this->idUser;
    }

    /**
     * Set idOeuvre
     *
     * @param integer $idOeuvre
     *
     * @return UserOeuvre
     */
    public function setIdOeuvre($idOeuvre)
    {
        $this->idOeuvre = $idOeuvre;

        return $this;
    }

    /**
     * Get idOeuvre
     *
     * @return int
     */
    public function getIdOeuvre()
    {
        return $this->idOeuvre;
    }

    /**
     * Set idStatus
     *
     * @param integer $idStatus
     *
     * @return UserOeuvre
     */
    public function setIdStatus($idStatus)
    {
        $this->idStatus = $idStatus;

        return $this;
    }

    /**
     * Get idStatus
     *
     * @return int
     */
    public function getIdStatus()
    {
        return $this->idStatus;
    }

    /**
     * Set rating
     *
     * @param float $rating
     *
     * @return UserOeuvre
     */
    public function setRating($rating)
    {
        $this->rating = $rating;

        return $this;
    }

    /**
     * Get rating
     *
     * @return float
     */
    public function getRating()
    {
        return $this->rating;
    }
}

